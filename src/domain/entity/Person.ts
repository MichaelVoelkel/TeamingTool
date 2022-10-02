import Skill from "domain/entity/Skill";

export default interface Person {
    id: string;
    name: string;
    skills: Skill[];
}