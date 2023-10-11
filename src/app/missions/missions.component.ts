import { Component, OnInit } from '@angular/core';
import { Mission } from '../mission';
import { MissionService } from '../mission.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit{

  missions: Mission[] = [];

  constructor(private missionService: MissionService) { }
  
  //Ordena obtener los 'heroes' cuando se inicializa la pagina
  ngOnInit(): void {
    this.getMissions();
  }
  // Obtiene los 'heroes' proporcionados por el HeroService que a la vez le llegan del fichero de mock heroes
  getMissions(): void {
    this.missionService.getMissions()
    .subscribe(missions => {
      this.missions = missions;
      console.log(missions);
    });
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.missionService.addMission({ name } as Mission)
      .subscribe(mission => {
        this.missions.push(mission);
      });
  }
  delete(mission: Mission): void {
    this.missions = this.missions.filter(h => h !== mission);
    this.missionService.deleteMission(mission.id).subscribe();
  }


}

 

