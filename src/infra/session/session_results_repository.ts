/*import SessionResults from "domain/session/session_results";
import SessionResultsRepository from "domain/session/session_results_repository";

export default class LocalSessionResultsRepository implements SessionResultsRepository {
    static readonly SESSION_RESULTS_KEY = "session_results";

    storeSessionResults(results: SessionResults): void {
        localStorage.setItem(LocalSessionResultsRepository.SESSION_RESULTS_KEY, JSON.stringify(results.toObject()));
    }

    loadSessionResults(): SessionResults {
        const item: string | null  = localStorage.getItem(LocalSessionResultsRepository.SESSION_RESULTS_KEY)

        if(item) {
            const parsedJSON: Record<string, any>[] = JSON.parse(item);

            return SessionResults.fromObject(parsedJSON);
        } else {
            return new SessionResults([]);
        }
    }
}*/

export default class LocalSessionResultsRepository {}