import React, { ReactNode, useCallback, useMemo } from 'react'
import {
  useListRecurringBuyForCoin,
  useOpenRecurringBuyFlayout,
  useRecurringBuyBannerFlyout,
  useRecurringBuyTracker
} from 'blockchain-wallet-v4-frontend/src/hooks'

import { LearnAboutRecurringBuyPanel } from '../../../LearnAboutRecurringBuyPanel'
import { RecurringBuyListItem } from '../../../RecurringBuyListItem'
import { RecurringBuyPanel } from '../../../RecurringBuyPanel'
import { UseRecurringBuyPanelHook } from './types'
import { convertInputCurrencyToNumber } from './utils'

export const useRecurringBuyPanel: UseRecurringBuyPanelHook = ({ coin }) => {
  const { data } = useListRecurringBuyForCoin({ coin })
  const [openRecurringBuy] = useOpenRecurringBuyFlayout()
  const [openRecurringBuyBanner] = useRecurringBuyBannerFlyout()
  const { trackOnClickLearnMore } = useRecurringBuyTracker()

  const recurringBuyListItems = useMemo(() => {
    if (!data) return []

    return data.map((recurringBuy) => (
      <RecurringBuyListItem
        key={recurringBuy.id}
        period={recurringBuy.period}
        date={new Date(recurringBuy.nextPayment)}
        currency={recurringBuy.inputCurrency}
        value={convertInputCurrencyToNumber(recurringBuy.inputCurrency, recurringBuy.inputValue)}
        onClick={() => openRecurringBuy({ origin: 'COIN_PAGE', recurringBuy })}
      />
    ))
  }, [data, openRecurringBuy])

  const handleOnClickOpenRecurringBuyBanner = useCallback(() => {
    openRecurringBuyBanner()
    trackOnClickLearnMore({
      origin: 'COIN_PAGE'
    })
  }, [openRecurringBuyBanner, trackOnClickLearnMore])

  const recurringBuysNode: ReactNode = useMemo(() => {
    if (!recurringBuyListItems) return null

    if (recurringBuyListItems.length === 0) {
      return <LearnAboutRecurringBuyPanel onClick={handleOnClickOpenRecurringBuyBanner} />
    }

    return <RecurringBuyPanel>{recurringBuyListItems}</RecurringBuyPanel>
  }, [recurringBuyListItems, handleOnClickOpenRecurringBuyBanner])

  return [recurringBuysNode]
}
