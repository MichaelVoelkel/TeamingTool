import TeamDto from "adapter/TeamDto";
import MainController from "app/main_controller";
import Konva from "konva";
import {Team as TeamComp, TeamHandle} from "frontend/components/Team";
import React, { createRef, MutableRefObject, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import MemberDto from "adapter/MemberDto";
import { Theme, ThemeContext } from "./themes";

export default function Home(props: any) {    
    const {mainController}: {mainController: MainController} = props;
    const [teams, setTeams] = useState<TeamDto[]>([
        {
            id: "Team1",
            label: "Team 1",
            x: 100,
            y: 200,
            members: [
                {
                    id: "member1",
                    label: "Megan Patita",
                    skills: [
                        {
                            id: "Qt",
                            label: "Qt",
                            level: 5,
                            color: "#ffaaaa"
                        },
                        {
                            id: "C++",
                            label: "C++",
                            level: 4,
                            color: "#aaaaff"
                        }
                    ]
                },
                {
                    id: "member2n",
                    label: "James London",
                    skills: []
                }
            ]
        },
        {
            id: "Team2",
            label: "CBD",
            x: 300,
            y: 200,
            members: [
                {
                    id: "member3",
                    label: "Michael Switzerfish",
                    skills: []
                },
                {
                    id: "member4",
                    label: "Double D. John",
                    skills: []
                }
            ]
        }
    ]);
    
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);

    let lastHoveredTeam: TeamHandle | undefined;

    const handleDragStart = (teamID: string, memberID: string) => {
        const thisTeamIdx = teams.findIndex((team: TeamDto) => team.id == teamID);
        if(thisTeamIdx != -1) {
            const thisTeam = teams[thisTeamIdx];
            const teamsCopy = teams.slice();
            teamsCopy.splice(thisTeamIdx, 1);
            teamsCopy.push(thisTeam);
            setTeams(teamsCopy);
        }
    };

    const handleDragMove = () => {
        const pos = stageRef.current!.getPointerPosition()!;
        let hoveredTeam: TeamHandle | undefined;

        Object.values(teamRefs.current!).some((childRef) => {
            const child = childRef.current!;
            const childX = child.getXInParent();
            const childY = child.getYInParent();
            
            if(pos.x > childX && pos.x < childX + child.getWidth() &&
                pos.y > childY && pos.y < childY + child.getHeight()) {
                hoveredTeam = child;
                child.focus();
                return true;
            }
            
            return false;
        });

        if(lastHoveredTeam && lastHoveredTeam != hoveredTeam) {
            lastHoveredTeam.unfocus();
        }

        lastHoveredTeam = hoveredTeam;
    };

    const handleDragEnd = (sourceTeamID: string, memberID: string) => {
        if(!lastHoveredTeam) {
            return;
        }

        lastHoveredTeam.unfocus();
        
        if(sourceTeamID == lastHoveredTeam?.getID()) {
            return;
        }

        let memberToMove: MemberDto | undefined;
        teams.some((team: TeamDto) => {
            memberToMove = team.members.find((member: MemberDto) => member.id == memberID);
            return memberToMove;
        });

        if(memberToMove) {
            const newTeams = teams.map((team: TeamDto) => {
                let newMembers = team.members;
                if(team.id == sourceTeamID) {
                    newMembers = team.members.filter((member: MemberDto) => member.id != memberID);
                }
                else if(team.id == lastHoveredTeam?.getID()) {
                    newMembers = team.members.concat(memberToMove!); 
                }

                return {
                    ...team,
                    members: newMembers
                }
            });
            setTeams(newTeams);
        }
    };

    const teamRefs = useRef<{[key:string]: MutableRefObject<TeamHandle>}>({});
    teams.forEach((team: TeamDto) => teamRefs.current![team.id] = teamRefs.current![team.id] ?? createRef());

    return <ThemeContext.Provider value={Theme.default}>
        <div className="flex flex-col text-zinc-400 h-full overflow-hidden">
            <h1 className="text-4xl p-10 text-center w-full flex-0 ">Teaming</h1>

            <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
                <Layer ref={layerRef}>
                    {teams.map((team: TeamDto) =>
                        <TeamComp
                            key={team.id}
                            ref={teamRefs.current![team.id]}
                            id={team.id}
                            label={team.label}
                            x={team.x}
                            y={team.y}
                            members={team.members}
                            handleDragStart={handleDragStart}
                            handleDragMove={handleDragMove}
                            handleDragEnd={handleDragEnd}
                        />
                    )}                
                </Layer>
            </Stage>
        </div>
    </ThemeContext.Provider>
}