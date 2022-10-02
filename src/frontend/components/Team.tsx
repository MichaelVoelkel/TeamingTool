import Konva from 'konva';
import React, { createRef, MutableRefObject, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { Group, Rect, Text } from "react-konva";
import MemberDto from 'adapter/MemberDto';
import SkillDto from 'adapter/SkillDto';
import { MemberRow, MemberRowHandle } from './MemberRow';
import { ThemeContext } from 'frontend/themes';

const highlightColor = "#ffffff";
const normalColor = "#eeeeff";
const rectStrokeColor = "#aaa";

export interface TeamProperties {
    id: string;
    label: string;
    members: MemberDto[];
    x: number;
    y: number;
    handleDragStart?: (teamID: string, memberID: string) => void;
    handleDragMove?: (teamID: string, memberID: string) => void;
    handleDragEnd?: (teamID: string, memberID: string) => void;
    rectRef?: React.Ref<TeamHandle>;
}

interface MemberProperties {
    id: string;
    name: string;
    x: number;
    y: number;
    skills: SkillDto[]
}

export interface TeamHandle {
    getXInParent: () => number;
    getYInParent: () => number;
    getWidth: () => number;
    getHeight: () => number;
    focus: () => void;
    unfocus: () => void;
    getID: () => string;
}

const TeamFct = (props: TeamProperties) => {
    const theme = useContext(ThemeContext);

    const [totalHeight, setTotalHeight] = useState(0);
    const [memberRepr, setMemberRepr] = useState<MemberProperties[]>([]);

    const renderAgain = () => {
        let y = 0;

        const candidates = props.members;

        props.members.forEach((member: MemberDto) => {
            const found = candidates.find(existingID => existingID.id == member.id) !== undefined;
            if(!found) {
                candidates.push(member);
            }
        });

        const newMembers = candidates.map((memberDto: MemberDto) => {
            const member = {
                id: memberDto.id,
                name: memberDto.label,
                x: 0, // <1 but different so it updates
                y: y,
                skills: memberDto.skills
            }
            y += theme.lineHeight + Math.random();
            
            return member;
        });

        setMemberRepr(newMembers.slice());

        setTotalHeight(newMembers.length * theme.lineHeight + theme.memberMarginTop + 2 + theme.padding);
    };

    useEffect(() => {
        renderAgain();
    }, [props.members]);

    useImperativeHandle(props.rectRef, () => ({
        getXInParent: () => rectRef.current!.getAbsolutePosition().x,
        getYInParent: () => rectRef.current!.getAbsolutePosition().y,
        getWidth: () => rectRef.current!.width(),
        getHeight: () => rectRef.current!.height(),
        focus: () => rectRef.current!.fill(highlightColor),
        unfocus: () => rectRef.current!.fill(normalColor),
        getID: () => props.id
    }));

    const memberRefs = useRef<{[key:string]: MutableRefObject<MemberRowHandle>}>({});
    memberRepr.forEach((member: MemberProperties) =>
        memberRefs.current![member.id] = memberRefs.current![member.id] ?? createRef<Text>()
    )

    const [rectWidth, setRectWidth] = useState<number>(0);

    useLayoutEffect(() => {
        let maxWidth = 0;
        for(const child of Object.values(memberRefs.current!)) {
            maxWidth = Math.max(maxWidth, child.current?.getWidth() ?? 0);
        }
        maxWidth = Math.max(maxWidth, titleRef.current?.width() ?? 0);
        setRectWidth(maxWidth + theme.padding * 2);
    });

    const rectRef = useRef<Konva.Rect>(null);
    const titleRef = useRef<Konva.Text>(null);

    const result = <Group draggable x={props.x} y={props.y}>
        <Rect
            ref={rectRef}
            team={props.id}
            fill={normalColor}
            stroke={rectStrokeColor} 
            width={isNaN(rectWidth) ? 0 : rectWidth}
            height={totalHeight}
        />

        <Text
            ref={titleRef}
            key="title"
            fontStyle="bold"
            text={props.label}
            x={(isNaN(rectWidth) ? 0 : rectWidth) / 2 - (titleRef.current?.width() ?? 0) / 2}
            y={theme.padding}
            align="center"
        />

        {memberRepr.map((member: MemberProperties) => <MemberRow
            ref={memberRefs.current![member.id]}
            teamID={props.id}
            key={member.id}
            x={member.x}
            y={member.y}
            label={member.name}
            memberID={member.id}
            skills={member.skills}
            onDragStart={props.handleDragStart}
            onDragMove={props.handleDragMove}
            onDragEnd={(teamID: string, memberID: string) => {
                props.handleDragEnd?.(teamID, memberID);
                renderAgain();
            }}
        />)}

        </Group>

    return result;
};

export const Team = React.forwardRef<TeamHandle, TeamProperties>((props, ref) => {
    const newProps = {
        ...props,
        rectRef: ref
    };
    return <TeamFct {...newProps} />
});