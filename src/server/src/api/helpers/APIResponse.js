/**
 * Class representing an API response.
 */
class APIExtendableResponse {
  /**
   * Creates an API response.
   * @param {boolean} boolSuccess - Error message.
   * @param {object} objResult - result object, only availabe in case request success.
   * @param {object} objError - an instance of Error, only availabe in case request failed.
   * @param {string} strCode - should be a constant value, only availabe in case request failed.
   */
  constructor(boolSuccess, objResult, objError, strCode) {
    this.success = boolSuccess;
    this.result = objResult;
    this.error = objError;
  }
}

/**
 * Class representing an API success response.
 */
export default class APIResponse extends APIExtendableResponse {
  /**
   * Creates an API success response.
   * @param {object} objResult - result object, only availabe in case request success.
   */
  constructor(objResult) {
    super(true, objResult, null, null);
  }
}

/**
 * Class representing an API Error response.
 */
export class APIErrorResponse extends APIExtendableResponse {
  /**
   * Creates an API Error response.
   * @param {object} objError - an instance of Error, only availabe in case request failed.
   * @param {string} strCode - should be a constant value, only availabe in case request failed.
   */
  constructor(objError, strCode = 'ERROR') {
    super(false, null, objError, strCode);
  }
}
