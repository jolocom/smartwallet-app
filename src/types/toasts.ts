interface ToastMessage {
  title: string
  message?: string
}

/**
 * A toast is either dismissible or not
 * if it is dismissible it can also optionally have
 * - a label (for the dismiss button)
 * - a timeout (to auto-dismiss)
 * - a callback
 */

interface ToastDismiss {
  dismiss?: false | number
}

/**
 * A toast may have a call to action button,
 * with a label and an onInteract callback
 * It is not possible to simply specify a boolean, because if an interaction is
 * expected then a callback and label are required.
 */
interface ToastInteract {
  interact?: {
    label: string
    onInteract: (...args: any) => void | boolean | Promise<void | boolean>
  }
}

type ToastPayload = {
  type: ToastType.warning | ToastType.info | ToastType.success
} & ToastMessage

interface ToastBase {
  id: string
  type: ToastType
}

type PartialToast = Partial<ToastBase> & ToastInteract & ToastDismiss

export type ToastBody = PartialToast & ToastMessage

let toastIds = 0

const createToastFactory =
  (template: PartialToast & Omit<ToastBase, 'id'>) =>
  (overrides: ToastBody): Toast =>
    ({
      id: toastIds++,
      ...template,
      ...overrides,
    } as Toast)

export type Toast = ToastBase & ToastInteract & ToastDismiss & ToastPayload

export enum ToastFilter {
  none,
  all,
  onlyDismissible,
}

export enum ToastType {
  info = 'info',
  warning = 'warning',
  success = 'success',
}

export const createInfoToast = createToastFactory({
  type: ToastType.info,
  dismiss: 8000,
})

export const createSuccessToast = createToastFactory({
  type: ToastType.success,
  dismiss: 8000,
})

export const createWarningToast = createToastFactory({
  type: ToastType.warning,
  dismiss: 8000,
})

export const createStickyToast = createToastFactory({
  type: ToastType.info,
  dismiss: false,
})
