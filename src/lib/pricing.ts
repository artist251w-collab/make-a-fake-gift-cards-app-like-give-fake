import type {
  BodyCondition,
  Category,
  ConditionAnswers,
  DeviceAge,
  DeviceModel,
  Quote,
  QuoteLine,
  ScreenCondition,
} from '../data/types'

export const SCREEN_OPTIONS: { id: ScreenCondition; title: string; description: string; factor: number }[] = [
  { id: 'flawless', title: 'Flawless', description: 'No scratches at all – looks brand new', factor: 1 },
  { id: 'minor', title: 'Minor scratches', description: '1–2 light scratches, not visible when screen is on', factor: 0.92 },
  { id: 'heavy', title: 'Heavy scratches', description: 'Multiple deep scratches visible when screen is on', factor: 0.8 },
  { id: 'cracked', title: 'Cracked / chipped', description: 'Glass is cracked, chipped or has dead pixels / lines', factor: 0.55 },
]

export const BODY_OPTIONS: { id: BodyCondition; title: string; description: string; factor: number }[] = [
  { id: 'flawless', title: 'Flawless', description: 'No scratches, dents or discolouration', factor: 1 },
  { id: 'minor', title: 'Minor scratches', description: 'Light scuffs or 1–2 tiny dents on the frame', factor: 0.94 },
  { id: 'major', title: 'Major dents', description: 'Visible dents, deep scratches or paint peeling', factor: 0.85 },
  { id: 'broken', title: 'Bent / panel broken', description: 'Back glass broken, body bent or panel loose', factor: 0.65 },
]

export const AGE_OPTIONS: { id: DeviceAge; title: string; description: string; factor: number }[] = [
  { id: 'lt3', title: 'Under 3 months', description: 'Almost new – still in brand warranty', factor: 1 },
  { id: '3to6', title: '3 – 6 months', description: 'In brand warranty', factor: 0.97 },
  { id: '6to11', title: '6 – 11 months', description: 'Warranty about to end', factor: 0.93 },
  { id: 'gt11', title: 'Over 11 months', description: 'Out of brand warranty', factor: 0.88 },
]

export const ACCESSORY_OPTIONS: { id: 'box' | 'charger' | 'bill'; title: string; description: string; deduct: number }[] = [
  { id: 'box', title: 'Original box', description: 'With matching IMEI / serial number', deduct: 0.02 },
  { id: 'charger', title: 'Original charger', description: 'Adapter and cable in working condition', deduct: 0.02 },
  { id: 'bill', title: 'Purchase invoice', description: 'Original bill from an authorised seller', deduct: 0.03 },
]

export const emptyAnswers = (variantId: string): ConditionAnswers => ({
  variantId,
  powersOn: null,
  corePass: null,
  screen: null,
  body: null,
  issues: [],
  accessories: [],
  age: null,
})

const roundTo = (n: number, step = 10) => Math.max(0, Math.round(n / step) * step)

/**
 * Computes an instant quote from the condition questionnaire.
 * Each answer contributes a transparent breakdown line so the user
 * can see exactly why the price moved. Every line is a whole-rupee
 * amount and the final price is exactly the sum of the lines.
 */
export function computeQuote(model: DeviceModel, category: Category, a: ConditionAnswers): Quote {
  const variant = model.variants.find((vr) => vr.id === a.variantId) ?? model.variants[0]
  const base = model.basePrice + variant.adj
  const lines: QuoteLine[] = [{ label: `${model.name} · ${variant.label}`, amount: base, kind: 'base' }]

  // A dead device only has salvage value.
  if (a.powersOn === false) {
    const salvage = roundTo(base * 0.12)
    lines.push({ label: 'Device does not switch on (salvage value)', amount: -(base - salvage), kind: 'minus' })
    return { price: salvage, base, lines, gradeLabel: 'Not working' }
  }

  let running = base
  const deduct = (label: string, amount: number) => {
    const cut = Math.round(amount)
    if (cut <= 0) return
    lines.push({ label, amount: -cut, kind: 'minus' })
    running -= cut
  }
  // Multiplicative factors apply to the running total (compounding),
  // fixed-percentage deductions apply to the base price.
  const applyFactor = (label: string, factor: number) => {
    if (factor < 1) deduct(label, running * (1 - factor))
  }

  if (a.corePass === false) applyFactor('Core functions not working', 0.55)

  const screen = SCREEN_OPTIONS.find((s) => s.id === a.screen)
  if (screen) applyFactor(`Screen: ${screen.title.toLowerCase()}`, screen.factor)

  const body = BODY_OPTIONS.find((b) => b.id === a.body)
  if (body) applyFactor(`Body: ${body.title.toLowerCase()}`, body.factor)

  for (const issueId of a.issues) {
    const issue = category.issues.find((i) => i.id === issueId)
    if (issue) deduct(issue.label, base * issue.deduct)
  }

  const age = AGE_OPTIONS.find((o) => o.id === a.age)
  if (age) applyFactor(`Age: ${age.title.toLowerCase()}`, age.factor)

  for (const acc of ACCESSORY_OPTIONS) {
    if (!a.accessories.includes(acc.id)) deduct(`No ${acc.title.toLowerCase()}`, base * acc.deduct)
  }

  // Never go below the minimum guaranteed value for a working device.
  const floor = Math.round(base * 0.18)
  if (running < floor) {
    lines.push({ label: 'Minimum guaranteed value adjustment', amount: floor - running, kind: 'plus' })
    running = floor
  }

  const price = Math.max(0, Math.round(running))
  const ratio = price / base
  const gradeLabel = ratio >= 0.9 ? 'Superb' : ratio >= 0.72 ? 'Good' : ratio >= 0.5 ? 'Fair' : 'Poor'
  return { price, base, lines, gradeLabel }
}

/** Highest possible payout for a model (best variant, perfect condition). */
export const maxPrice = (model: DeviceModel) =>
  model.basePrice + Math.max(...model.variants.map((vr) => vr.adj))
