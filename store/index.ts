export const kungalgameStoreReset = () => {
  usePersistEditGalgameStore().$reset()
  usePersistEditTopicStore().$reset()
  usePersistKUNGalgameReplyStore().$reset()
  usePersistKUNGalgameTopicStore().$reset()
  usePersistCategoryStore().$reset()
  usePersistKUNGalgameHomeStore().$reset()
  usePersistUserStore().$reset()
  usePersistSettingsStore().$reset()

  useTempEditStore().$reset()
  useTempGalgamePRStore().$reset()
  useTempGalgameStore().$reset()
  useTempGalgameResourceStore().$reset()
  useTempReplyStore().$reset()
  useTempSearchStore().$reset()
  useComponentMessageStore().$reset()
  useTempSettingStore().$reset()
}
