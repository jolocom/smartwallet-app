import React, { useEffect, useState } from 'react'

import { useLoader } from '~/hooks/loader'
import { useFinishInteraction } from '~/hooks/interactions/handlers'
import useConnection from '~/hooks/connection'
import { BottomButtons } from '~/components/BottomButtons'
import { useToasts } from '~/hooks/toasts'

interface Props {
  submitLabel: string
  onSubmit: () => Promise<void>
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

  const [_, setDisableButton] = useState<boolean | null>(false)

  useEffect(() => {
    setDisableButton(connected)
  }, [connected])

  const { scheduleErrorWarning } = useToasts()

  const handleSubmit = () => {
    if (disableLoader) onSubmit().catch(scheduleErrorWarning)
    loader(
      async () => {
        await onSubmit()
      },
      { showSuccess: false, showFailed: false },
    ).catch(scheduleErrorWarning)
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
