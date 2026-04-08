// Shared site utilities
(function () {
  const MIN_QUERY_LENGTH = 2;
  const MAX_QUERY_LENGTH = 80;
  const SEARCH_RESULTS_PATH = '/search/';
  const SEARCH_INDEX_PATH = '/index.json';

  function sanitizeQuery(rawQuery) {
    return (rawQuery || '').replace(/\s+/g, ' ').trim();
  }

  function validateSearchQuery(rawQuery) {
    const value = sanitizeQuery(rawQuery);

    if (value.length < MIN_QUERY_LENGTH) {
      return {
        valid: false,
        value,
        message: `Please enter at least ${MIN_QUERY_LENGTH} characters.`
      };
    }

    if (value.length > MAX_QUERY_LENGTH) {
      return {
        valid: false,
        value,
        message: `Search must be at most ${MAX_QUERY_LENGTH} characters.`
      };
    }

    return { valid: true, value, message: '' };
  }

  window.FormValidation = {
    MIN_QUERY_LENGTH,
    MAX_QUERY_LENGTH,
    SEARCH_RESULTS_PATH,
    SEARCH_INDEX_PATH,
    sanitizeQuery,
    validateSearchQuery
  };
})();
