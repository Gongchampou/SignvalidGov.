/**
 * SignValid Security Engine — Client-Side Rate Limiter & Abuse Prevention
 * 
 * Rules:
 * 1. Rate limit per second: Minimum 1,000ms throttle between verification actions.
 * 2. Rate limit per minute: Maximum 6 certificate verifications per 60-second sliding window.
 */

const MIN_INTERVAL_MS = 1000; // 1 second per action throttle
const WINDOW_DURATION_MS = 60000; // 60-second sliding window
const MAX_CERTS_PER_WINDOW = 6; // 6 certificates per minute

class SecurityRateLimiter {
  private lastActionTimestamp: number = 0;
  private verificationTimestamps: number[] = [];

  /**
   * Cleans up expired timestamps outside the 60-second window
   */
  private cleanWindow(now: number): void {
    this.verificationTimestamps = this.verificationTimestamps.filter(
      (ts) => now - ts < WINDOW_DURATION_MS
    );
  }

  /**
   * Inspects rate limits for an incoming batch of files/certificates
   */
  public evaluateVerification(requestedCount: number): {
    allowed: boolean;
    allowedCount: number;
    throttledCount: number;
    waitSeconds: number;
    message: string;
  } {
    const now = Date.now();

    // 1. Throttling check (1 per second minimum interval)
    const timeSinceLastAction = now - this.lastActionTimestamp;
    if (timeSinceLastAction < MIN_INTERVAL_MS) {
      const waitMs = MIN_INTERVAL_MS - timeSinceLastAction;
      const waitSec = Math.max(1, Math.ceil(waitMs / 1000));
      return {
        allowed: false,
        allowedCount: 0,
        throttledCount: requestedCount,
        waitSeconds: waitSec,
        message: 'Security Rate Limit: Throttled to 1 verification per second. Please wait a moment.'
      };
    }

    // 2. Sliding window check (6 certs per minute)
    this.cleanWindow(now);
    const currentCount = this.verificationTimestamps.length;
    const remainingQuota = Math.max(0, MAX_CERTS_PER_WINDOW - currentCount);

    if (remainingQuota <= 0) {
      const oldestTs = this.verificationTimestamps[0] || (now - WINDOW_DURATION_MS);
      const waitSec = Math.max(1, Math.ceil((WINDOW_DURATION_MS - (now - oldestTs)) / 1000));
      return {
        allowed: false,
        allowedCount: 0,
        throttledCount: requestedCount,
        waitSeconds: waitSec,
        message: `Security Rate Limit: Maximum 6 certificates per minute. Cooldown active for ${waitSec}s.`
      };
    }

    // Compute how many files are allowed in this action
    const allowedCount = Math.min(requestedCount, remainingQuota);
    const throttledCount = requestedCount - allowedCount;

    // Register approved verification timestamps
    this.lastActionTimestamp = now;
    for (let i = 0; i < allowedCount; i++) {
      this.verificationTimestamps.push(now);
    }

    let message = '';
    if (throttledCount > 0) {
      message = `Security Rate Limit: Processing ${allowedCount} certificate(s). ${throttledCount} file(s) throttled (limit: 6 certs/min).`;
    }

    return {
      allowed: true,
      allowedCount,
      throttledCount,
      waitSeconds: 0,
      message
    };
  }

  /**
   * Rate limits sample document testing
   */
  public evaluateSampleTest(): { allowed: boolean; message: string; waitSeconds: number } {
    const now = Date.now();
    const timeSinceLastAction = now - this.lastActionTimestamp;
    if (timeSinceLastAction < MIN_INTERVAL_MS) {
      return {
        allowed: false,
        waitSeconds: 1,
        message: 'Security Rate Limit: Please wait 1 second between testing sample certificates.'
      };
    }

    this.cleanWindow(now);
    if (this.verificationTimestamps.length >= MAX_CERTS_PER_WINDOW) {
      const oldestTs = this.verificationTimestamps[0] || (now - WINDOW_DURATION_MS);
      const waitSec = Math.max(1, Math.ceil((WINDOW_DURATION_MS - (now - oldestTs)) / 1000));
      return {
        allowed: false,
        waitSeconds: waitSec,
        message: `Security Rate Limit: Maximum 6 certificates per minute. Please wait ${waitSec}s.`
      };
    }

    this.lastActionTimestamp = now;
    this.verificationTimestamps.push(now);
    return { allowed: true, message: '', waitSeconds: 0 };
  }
}

export const securityRateLimiter = new SecurityRateLimiter();
