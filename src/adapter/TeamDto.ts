import Team from "domain/entity/Team";
import Person from "domain/entity/Person";
import MemberDto from "./MemberDto";

export default interface TeamDto {
    id: string;
    label: string;
    x: number;
    y: number;
    members: MemberDto[]
}

export const createTeamDto = (team: Team, persons: Person[]): TeamDto => {
    let teamDto: TeamDto = {
        id: team.id,
        label: team.label,
        x: team.x,
        y: team.y,
        members: []
    };
    
    for(const person of persons) {
        let memberDto: MemberDto = {
            id: person.id,
            label: person.name,
            skills: []
        };
        
        for(const skill of person.skills) {
            let skillDto = {
                id: skill.id,
                label: skill.id,
                level: skill.level,
                color: skill.color
            };
            memberDto.skills.push(skillDto);
        }

        teamDto.members.push(memberDto);
    }

    return teamDto;
};