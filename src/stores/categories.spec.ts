import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'
import { useCategoryStore, useTorrentStore } from '.'
import { TorrentState } from '@/constants/qbit'
import { Category, RawQbitTorrent } from '@/types/qbit/models'

function makeRawTorrent(hash: string, category: string): [string, RawQbitTorrent] {
  return [
    hash,
    {
      added_on: 1,
      amount_left: 0,
      auto_tmm: false,
      availability: 1,
      category,
      comment: '',
      completed: 0,
      completion_on: 0,
      content_path: '',
      dl_limit: 0,
      dlspeed: 0,
      download_path: '',
      downloaded: 0,
      downloaded_session: 0,
      eta: 0,
      f_l_piece_prio: false,
      force_start: false,
      has_metadata: true,
      inactive_seeding_time_limit: 0,
      infohash_v1: hash,
      infohash_v2: hash,
      last_activity: 0,
      magnet_uri: '',
      max_inactive_seeding_time: 0,
      max_ratio: 0,
      max_seeding_time: 0,
      name: hash,
      num_complete: 0,
      num_incomplete: 0,
      num_leechs: 0,
      num_seeds: 0,
      popularity: 0,
      priority: 0,
      private: false,
      progress: 1,
      ratio: 0,
      ratio_limit: 0,
      reannounce: 0,
      save_path: '',
      seeding_time: 0,
      seeding_time_limit: 0,
      seen_complete: 0,
      seq_dl: false,
      size: 0,
      state: TorrentState.UPLOADING,
      super_seeding: false,
      tags: '',
      time_active: 0,
      total_size: 0,
      tracker: '',
      trackers_count: 0,
      up_limit: 0,
      uploaded: 0,
      uploaded_session: 0,
      upspeed: 0,
    },
  ]
}

describe('stores/categories', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('includes emoji categories from torrents even when missing from maindata category list', () => {
    const torrentStore = useTorrentStore()
    const categoryStore = useCategoryStore()

    const serverCategory: Category = { name: 'regular', savePath: '/tmp', downloadPathEnabled: false, downloadPath: '' }
    categoryStore.syncFromMaindata(true, [['regular', serverCategory]])
    torrentStore.syncFromMaindata(true, [makeRawTorrent('abc123', '🎬 Movies')])

    const categoryNames = categoryStore.categories.map(c => c.name)
    expect(categoryNames).toContain('🎬 Movies')
    expect(categoryNames).toContain('regular')
    expect(categoryStore.torrentsByCategory['🎬 Movies']).toBe(1)
  })
})
