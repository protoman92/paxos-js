import { Observable, Observer } from 'rxjs';
import { Try } from 'javascriptutilities';
import * as Message from './Message';
import * as SId from './SuggestionId';

export namespace Participant {
  /**
   * Represents common APIs used by participants in a Paxos instance.
   * @template T Generic parameter.
   */
  export interface Type<T> {
    /**
     * Listen to message. For e.g., this can be a remote persistent connection.
     * @param {string} uid The participant's id.
     * @returns {Observable<Try<Message.Generic.Type<T>>>} An Observable instance.
     */
    receiveMessages(uid: string): Observable<Try<Message.Generic.Type<T>>>;

    /**
     * Send a message to a target.
     * @param {string} target A string value denoting the target's uid.
     * @param {Message.Generic.Type<T>} msg A generic message instance.
     * @returns {Observable<Try<any>>} An Observable instance.
     */
    sendMessage(target: string, msg: Message.Generic.Type<T>): Observable<Try<any>>;

    /**
     * Error trigger for a participant. This error could be stored somewhere
     * like a log.
     * @param {string} uid The participant's uid.
     * @returns {Try<Observer<Error>>} A Try instance.
     */
    errorTrigger(uid: string): Try<Observer<Error>>;

    /**
     * The error stream that relays errors for a particular participant.
     * @param {string} uid The participant's uid.
     * @returns {Observable<Try<Error>>} An Observable instance.
     */
    errorStream(uid: string): Observable<Try<Error>>;
  }
}

export namespace Suggester {
  /**
   * Represents the APIs used by a suggester.
   * @extends {Participant.Type<T>} Participant extension.
   * @template T Generics parameter.
   */
  export interface Type<T> extends Participant.Type<T> {}
}

export namespace Voter {
  /**
   * Represents the APIs used by a voter.
   * @extends {Participant.Type<T>} Participant extension.
   */
  export interface Type<T> extends Participant.Type<T> {
    // grantPermission(message: Permission.Granted.Type<T>): Observable<Try<void>>;
    // sendNack(message: Nack.Type): Observable<Try<void>>;
    // storeLastAcceptedData(obj: LastAccepted.Type<T>): Observable<Try<void>>;

    /**
     * Retrieve the suggestion id of the last granted permission request. This
     * will be used by the voter to process new permission requests.
     * @param {string} uid The voter's id.
     * @returns {Observable<Try<SId.Type>>} An Observable instance.
     */
    getLastGrantedSuggestionId(uid: string): Observable<Try<SId.Type>>;

    /**
     * Store the last accepted suggestion id in stable media.
     * @param {string} uid The voter's id.
     * @param {SId.Type} obj A suggestion id instance.
     * @returns {Observable<Try<any>>} An Observable instance.
     */
    storeLastGrantedSuggestionId(uid: string, obj: SId.Type): Observable<Try<any>>;

    /**
     * Retrieve the last accepted data.
     * @param {string} uid The voter's id.
     * @returns {Observable<Try<Message.LastAccepted.Type<T>>>} An Observable
     * instance.
     */
    getLastAcceptedData(uid: string): Observable<Try<Message.LastAccepted.Type<T>>>;
  }
}

export namespace Node {
  /**
   * Represents the APIs usable by a Node. This encompasses all APIs available
   * to arbiters, suggesters and voters.
   * @extends {Voter.Type<T>} Voter API extension.
   * @template T Generics parameter.
   */
  export interface Type<T> extends Voter.Type<T> {}
}