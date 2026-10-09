export class CacheService {
  // Provide a generic method signature avoiding `any` and unused parameter
  getData<T = unknown>(request?: T): Promise<null> {
    void request; // mark as used
    return Promise.resolve(null);
  }
}
export default {} as Record<string, never>;
