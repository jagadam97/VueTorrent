<script lang="ts" setup>
import { TorrentState } from '@/constants/vuetorrent'
import { getTorrentStateValue } from '@/helpers'
import { useCategoryStore, useTagStore, useTorrentStore, useTrackerStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()
const { statusFilter, categoryFilter, tagFilter, trackerFilter } = storeToRefs(useTorrentStore())
const trackerStore = useTrackerStore()
const torrentStore = useTorrentStore()

const statuses = computed(() =>
  Object.values(TorrentState)
    .filter(state => typeof state === 'number')
    .map(state => ({ title: t(`torrent.state.${getTorrentStateValue(state as TorrentState)}`), value: state }))
)
const categories = computed(() => [{ title: t('navbar.side.filters.uncategorized'), value: '' }, ...categoryStore.categories.map(c => c.name)])
const tags = computed(() => [{ title: t('navbar.side.filters.untagged'), value: null }, ...tagStore.tags])
const trackers = computed(() => [{ title: t('navbar.side.filters.untracked'), value: null }, ...trackerStore.trackers])
function selectAllStatuses() {
  statusFilter.value = []
}

const activeTorrentsStates = [
  TorrentState.UPLOADING,
  TorrentState.CHECKING_DISK,
  TorrentState.UL_FORCED,
  TorrentState.DOWNLOADING,
  TorrentState.META_DOWNLOAD,
  TorrentState.FORCED_META_DOWNLOAD,
  TorrentState.CHECKING_DISK,
  TorrentState.DL_FORCED,
  TorrentState.CHECKING_RESUME_DATA,
  TorrentState.MOVING
]

function selectActive() {
  statusFilter.value = activeTorrentsStates
}

const erroredTorrentsStates = [TorrentState.ERROR, TorrentState.MISSING_FILES, TorrentState.UNKNOWN]

function selectError() {
  statusFilter.value = erroredTorrentsStates
}

const offlineTorrentsStates = [
  TorrentState.ERROR,
  TorrentState.MISSING_FILES,
  TorrentState.UNKNOWN,
  TorrentState.MOVING,
  TorrentState.DL_PAUSED,
  TorrentState.UL_PAUSED,
  TorrentState.CHECKING_DISK,
  TorrentState.CHECKING_RESUME_DATA
]

function selectOffline() {
  statusFilter.value = offlineTorrentsStates
}

function selectAllCategories() {
  categoryFilter.value = []
}

function selectAllTags() {
  tagFilter.value = []
}

function selectAllTrackers() {
  trackerFilter.value = []
}
function evaluateFilteredLength({ localStatusFilter }) {
  return computed(() => {
    return torrentStore.torrents.filter(torrent => {
      const matchesState = localStatusFilter.length == 0 || localStatusFilter.value.includes(torrent.state)

      return matchesState
    }).length
  })
}
</script>

<template>
  <v-list class="pb-0 inherit-fg">
    <v-list-item class="px-0 pb-3">
      <v-list-item-title class="px-0 text-uppercase ml-1 font-weight-light text-subtitle-2">
        {{ t('navbar.side.filters.state.title') }}
      </v-list-item-title>
      <v-select
        v-model="statusFilter"
        :items="statuses.sort((a, b) => a.title.localeCompare(b.title))"
        :placeholder="t('navbar.side.filters.disabled')"
        bg-color="secondary"
        class="text-accent pt-1"
        density="compact"
        hide-details
        multiple
        variant="solo">
        <template v-slot:prepend-item>
          <v-list-item :title="$t('common.disable')" @click="selectAllStatuses" />
          <v-list-item
            :title="$t('navbar.side.filters.state.active', { count: evaluateFilteredLength({ localStatusFilter: ref(activeTorrentsStates) }).value })"
            @click="selectActive" />
          <v-list-item
            :title="$t('navbar.side.filters.state.error', { count: evaluateFilteredLength({ localStatusFilter: ref(erroredTorrentsStates) }).value })"
            @click="selectError" />
          <v-list-item
            :title="$t('navbar.side.filters.state.offline', { count: evaluateFilteredLength({ localStatusFilter: ref(offlineTorrentsStates) }).value })"
            @click="selectOffline" />
          <v-divider />
        </template>
        <template v-slot:selection="{ item, index }">
          <span v-if="index === 0 && statusFilter.length === 1" class="text-accent">{{ item.title }}</span>
          <span v-else-if="index === 0" class="text-accent">{{ t('navbar.side.filters.activeFilter', statusFilter.length) }}</span>
        </template>
      </v-select>
    </v-list-item>

    <v-list-item class="px-0 pb-3">
      <v-list-item-title class="px-0 text-uppercase ml-1 font-weight-light text-subtitle-2">
        {{ t('navbar.side.filters.category') }}
      </v-list-item-title>
      <v-select
        v-model="categoryFilter"
        :items="categories"
        :placeholder="t('navbar.side.filters.disabled')"
        bg-color="secondary"
        class="text-accent pt-1"
        density="compact"
        hide-details
        multiple
        variant="solo">
        <template v-slot:prepend-item>
          <v-list-item :title="$t('common.disable')" @click="selectAllCategories" />
          <v-divider />
        </template>
        <template v-slot:selection="{ item, index }">
          <span v-if="index === 0 && categoryFilter.length === 1" class="text-accent">
            {{ item.props.title }}
          </span>
          <span v-else-if="index === 0" class="text-accent">
            {{ t('navbar.side.filters.activeFilter', categoryFilter.length) }}
          </span>
        </template>
      </v-select>
    </v-list-item>

    <v-list-item class="px-0 pb-3">
      <v-list-item-title class="px-0 text-uppercase ml-1 font-weight-light text-subtitle-2">
        {{ t('navbar.side.filters.tag') }}
      </v-list-item-title>
      <v-select
        v-model="tagFilter"
        :items="tags"
        :placeholder="t('navbar.side.filters.disabled')"
        bg-color="secondary"
        class="text-accent pt-1"
        density="compact"
        hide-details
        multiple
        variant="solo">
        <template v-slot:prepend-item>
          <v-list-item :title="$t('common.disable')" @click="selectAllTags" />
          <v-divider />
        </template>
        <template v-slot:selection="{ item, index }">
          <span v-if="index === 0 && tagFilter.length === 1" class="text-accent">
            {{ item.props.title }}
          </span>
          <span v-else-if="index === 0" class="text-accent">
            {{ t('navbar.side.filters.activeFilter', tagFilter.length) }}
          </span>
        </template>
      </v-select>
    </v-list-item>

    <v-list-item class="px-0 pb-3">
      <v-list-item-title class="px-0 text-uppercase ml-1 font-weight-light text-subtitle-2">
        {{ t('navbar.side.filters.tracker') }}
      </v-list-item-title>
      <v-select
        v-model="trackerFilter"
        :items="trackers"
        :placeholder="t('navbar.side.filters.disabled')"
        bg-color="secondary"
        class="text-accent pt-1"
        density="compact"
        hide-details
        multiple
        variant="solo">
        <template v-slot:prepend-item>
          <v-list-item :title="$t('common.disable')" @click="selectAllTrackers" />
          <v-divider />
        </template>
        <template v-slot:selection="{ item, index }">
          <span v-if="index === 0 && trackerFilter.length === 1" class="text-accent">
            {{ item.props.title }}
          </span>
          <span v-else-if="index === 0" class="text-accent">
            {{ t('navbar.side.filters.activeFilter', trackerFilter.length) }}
          </span>
        </template>
      </v-select>
    </v-list-item>
  </v-list>
</template>

<style scoped></style>
