import { onThemeChange, onThemeInit, onShowCustomThemeView } from './theme'
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending/index';
import { onLoadFavoriteData } from './favorite'
import { onLoadLanguage } from './language'
import { onSearch, onSearchCancel, onLoadMoreSearch } from './search'

export default {
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView,
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onLoadLanguage,
  onSearch,
  onSearchCancel,
  onLoadMoreSearch
}