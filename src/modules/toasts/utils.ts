import { ToastFilter, Toast } from '~/types/toasts'

export const toastMatchesFilter = (
  filter: ToastFilter,
  toast: Toast,
): boolean => {
  switch (filter) {
    case ToastFilter.all:
      return true
    case ToastFilter.onlyDismissible:
      return !!toast.dismiss
    default:
      return false
  }
}
