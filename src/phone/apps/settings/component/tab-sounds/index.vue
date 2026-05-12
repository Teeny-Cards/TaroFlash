<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UiSlider from '@/components/ui-kit/slider.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'

const { t } = useI18n()

const interface_volume = ref(50)
const alerts_volume = ref(50)
const rewards_volume = ref(50)
</script>

<template>
  <section-list data-testid="tab-sounds">
    <labeled-section :label="t('settings.sounds.section.audio')">
      <div
        data-testid="tab-sounds__sliders"
        class="grid grid-cols-[auto_1fr] gap-y-8 gap-x-20 text-brown-700 dark:text-brown-300 select-none"
      >
        <h3>{{ t('settings.sounds.interface') }}</h3>
        <ui-slider :label="t('settings.sounds.interface')" v-model="interface_volume" />
        <h3>{{ t('settings.sounds.alerts') }}</h3>
        <ui-slider :label="t('settings.sounds.alerts')" v-model="alerts_volume" />
        <h3>{{ t('settings.sounds.rewards') }}</h3>
        <ui-slider :label="t('settings.sounds.rewards')" v-model="rewards_volume" />
      </div>
    </labeled-section>
  </section-list>
</template>
