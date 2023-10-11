import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mission } from './mission';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient
    ) { }

    /* //To return an array of mock heroes
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }
  */
 
  //The heroes web API expects a special header in HTTP save requests:
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private missionsUrl = 'http://localhost:9090/missions/';  // URL to web api


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  /** GET heroes from the server */
  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.missionsUrl)
      .pipe(
        tap(_ => this.log('fetched missions')),
        catchError(this.handleError<Mission[]>('getMissions', []))
     );
  }
/*
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
  */

  /** GET hero by id. Will 404 if id not found */
  getMission(id: string): Observable<Mission> {
    const url = `${this.missionsUrl}/${id}`;
    return this.http.get<Mission>(url).pipe(
      tap(_ => this.log(`fetched mission id=${id}`)),
      catchError(this.handleError<Mission>(`getMission id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateMission(mission: Mission): Observable<any> {
    return this.http.put(this.missionsUrl, mission, this.httpOptions).pipe(
      tap(_ => this.log(`updated mission id=${mission.id}`)),
      catchError(this.handleError<any>('updateMission'))
    );
  }

  /** POST: add a new hero to the server */
  addMission(mission: Mission): Observable<Mission> {
    return this.http.post<Mission>(this.missionsUrl, mission, this.httpOptions).pipe(
      tap((newMission: Mission) => this.log(`added mission w/ id=${newMission.id}`)),
      catchError(this.handleError<Mission>('addMission'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteMission(id: string): Observable<Mission> {
    const url = `${this.missionsUrl}/${id}`;

    return this.http.delete<Mission>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted mission id=${id}`)),
      catchError(this.handleError<Mission>('deleteMission'))
    );
  }

    /* GET heroes whose name contains search term */
  searchMissions(term: string): Observable<Mission[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
   }
    return this.http.get<Mission[]>(`${this.missionsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found missions matching "${term}"`) :
         this.log(`no missions matching "${term}"`)),
     catchError(this.handleError<Mission[]>('searchMissions', []))
   );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
  this.messageService.add(`MissionService: ${message}`);
  }
}

