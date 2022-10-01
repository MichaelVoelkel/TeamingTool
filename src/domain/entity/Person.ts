import Skill from "domain/skill/Skill";

export default interface Person {
    id: string;
    name: string;
    skills: Skill[];
}