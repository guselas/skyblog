import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';


export abstract class PostStore < T > {
  private state$: BehaviorSubject < T > = new BehaviorSubject(undefined);
  get = (): T => this.state$.getValue();
  get$ = (): Observable < T > => this.state$.asObservable();
  store = (nextState: T) => this.state$.next(nextState);

}
