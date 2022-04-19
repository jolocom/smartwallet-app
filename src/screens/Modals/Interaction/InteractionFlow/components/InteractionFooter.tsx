import React from 'react'

import { useLoader } from '~/hooks/loader'
import { useFinishInteraction } from '~/hooks/interactions/handlers'
import useConnection from '~/hooks/connection'
import { BottomButtons } from '~/components/BottomButtons'

interface Props {
  submitLabel: string
  onSubmit: () => Promise<void> | void
  onCancel?: () => void
  disabled?: boolean
  disableLoader?: boolean
}

const InteractionFooter: React.FC<Props> = ({
  submitLabel,
  onSubmit,
  onCancel,
  disabled = false,
  disableLoader = false,
}) => {
  const loader = useLoader()
  const { clearInteraction, closeInteraction } = useFinishInteraction()
  const { connected } = useConnection()

  const handleSubmit = () => {
    if (disableLoader) return onSubmit()
    loader(
      async () => {
        await onSubmit()
      },
      { showSuccess: false, showFailed: false },
    ).catch(console.warn)
  }

  const handleCancel = () => {
    clearInteraction()
    closeInteraction()
  }

  return (
    <BottomButtons
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      onCancel={onCancel ?? handleCancel}
      isSubmitDisabled={!connected || disabled}
    />
  )
}

export default InteractionFooter
