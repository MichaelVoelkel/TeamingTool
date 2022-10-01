import Konva from 'konva';
import React, { createRef, forwardRef, MutableRefObject, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { Group, Rect, Text } from "react-konva";
import MemberDto from 'adapter/MemberDto';

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
}

export interface TeamHandle {
    getXInParent: () => number;
    getYInParent: () => number;
    getWidth: () => number;
    getHeight: () => number;
    focus: () => void;
    unfocus: () => void;
    getID: () => string;
};

const TeamFct = (props: TeamProperties) => {
    const FONT_SIZE = 14;
    const LINE_HEIGHT = FONT_SIZE * 1.5;
    const PADDING = 8;
    const MEMBER_MARGIN_TOP = LINE_HEIGHT;

    const [totalHeight, setTotalHeight] = useState(0);
    const [memberRepr, setMemberRepr] = useState<MemberProperties[]>([]);

    const renderAgain = () => {
        let y = 0;

        let candidates = props.members;

        props.members.forEach((member: MemberDto) => {
            let found = candidates.find(existingID => existingID.id == member.id) !== undefined;
            if(!found) {
                candidates.push(member);
            }
        });

        const newMembers = candidates.map((memberDto: MemberDto) => {
            const member = {
                id: memberDto.id,
                name: memberDto.label,
                x: Math.random(), // <1 but different so it updates
                y: y + Math.random() // same
            }
            y += LINE_HEIGHT + Math.random();
            
            return member;
        });

        setMemberRepr(newMembers.slice());

        setTotalHeight(newMembers.length * LINE_HEIGHT + MEMBER_MARGIN_TOP + 2 + PADDING);
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

    const memberRefs = useRef<{[key:string]: MutableRefObject<Konva.Text>}>({});
    memberRepr.forEach((member: MemberProperties) =>
        memberRefs.current![member.id] = memberRefs.current![member.id] ?? createRef<Text>()
    )

    const [rectWidth, setRectWidth] = useState<number>(0);

    useLayoutEffect(() => {
        let maxWidth = 0;
        for(const child of Object.values(memberRefs.current!)) {
            maxWidth = Math.max(maxWidth, child.current?.width() ?? 0);
        }
        maxWidth = Math.max(maxWidth, titleRef.current?.width() ?? 0);
        setRectWidth(maxWidth + PADDING * 2);
    });

    const rectRef = useRef<Konva.Rect>(null);
    const titleRef = useRef<Konva.Text>(null);

    const result = <Group draggable x={props.x} y={props.y}>
        <Rect
            ref={rectRef}
            team={props.id}
            fill={normalColor}
            stroke={rectStrokeColor} 
            width={rectWidth}
            height={totalHeight}
        />

        <Text
            ref={titleRef}
            key="title"
            fontSize={FONT_SIZE}
            fontStyle="bold"
            text={props.label}
            x={rectWidth / 2 - (titleRef.current?.width() ?? 0) / 2}
            y={PADDING}
            align="center"
        />

        {memberRepr.map((member: MemberProperties) => {
            const row = <Text
                draggable 
                ref={memberRefs.current![member.id]}
                key={member.id}
                id={member.id}
                fontSize={FONT_SIZE}
                text={member.name}
                onDragStart={(e) => {
                    e.cancelBubble = true;
                    props.handleDragStart?.(props.id, member.id);
                }}
                onDragMove={() => {
                    props.handleDragMove?.(props.id, member.id)
                    memberRefs.current![member.id].current!.moveToTop();
                }}
                onDragEnd={() => {
                    props.handleDragEnd?.(props.id, member.id);
                    console.log("Anyway render again")
                    renderAgain();
                }}
                x={member.x+PADDING}
                y={member.y+PADDING+MEMBER_MARGIN_TOP}
            />

            return row;
        })}
        
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