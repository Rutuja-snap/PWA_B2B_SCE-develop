module.exports = {
  CacheService: class CacheService { 
    async getData(){return 'MOCK_CACHE_DATA';}
    get(){return undefined;}
    set(){/* empty */}
  }
};
// Support requiring internal path names if library re-exports (defensive)
module.exports.CacheOrchestrator = module.exports.CacheService;
