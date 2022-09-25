import Skill from "domain/skill/Skill";

export interface Rule {
    weight : number;
}

export interface MinSkillsPerTeam extends Rule {
    minPeoplPerSkill :Map<Skill, number> ;
}

export interface WorkWellTogether extends Rule {
    peopleIDs : string [];
}

export interface CommunicationNeed extends Rule {
    onSkill : string;
}

