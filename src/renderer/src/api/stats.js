import {Get, Put} from "@renderer/api/index";
import URLS from './url'

export default {

    getTrendData: (params) => {
        return Get(URLS.STATS_TREND_URL, params);
    },

    postStatsData: (params) => {
        return Get(URLS.STATS_ALL_URL, params);
    },

    getHotTrend: (params) => {
        return Get(URLS.STATS_HOT_TREND, params);
    },

    getSearchHistory: (params) => {
        return Get(URLS.STATS_SEARCH_HISTORY, params);
    },

    removeSearchHistory: (params) => {
        return Put(URLS.REMOVE_SEARCH_KEY, params);
    },

    getRecentDoc: (params) => {
        return Get(URLS.STATS_RECENT_DOC, params);
    },

    getMonthStat: (params) => {
        return Get(URLS.STATS_MONTH_URL, params);
    },

}