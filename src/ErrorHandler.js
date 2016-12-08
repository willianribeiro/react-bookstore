import PubSub from 'pubsub-js';

export default class ErrorHandler {
  publishErrors(response) {
    var errors;
    
    errors = response.errors;
    for (var i = 0; i < errors.length; i++) {
      PubSub.publish('formValidator:error', errors[i]);
    }
  }
}
