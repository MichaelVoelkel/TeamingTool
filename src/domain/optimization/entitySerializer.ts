import Person from "domain/entity/Person";
import { Rule } from "domain/rules/Rules";

// output format should fit: 
// https://github.com/kchinzei/linear-program-solver

export default function serializeToLP(persons: Person[], rules: Rule[]): string {
    // we need to have soft and hard constraints
    return ""
}