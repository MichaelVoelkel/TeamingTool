import SkillDto from "./SkillDto";

export default interface MemberDto {
    id: string;
    label: string;
    skills: SkillDto[]
}