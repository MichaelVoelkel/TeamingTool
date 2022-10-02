import SkillDto from "adapter/SkillDto";
import { ThemeContext } from "frontend/themes";
import Konva from "konva";
import React, { createRef, MutableRefObject, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Group, Text } from "react-konva";
import { isJSDocThisTag } from "typescript";
import {SkillTag, SkillTagHandle} from "./SkillTag";

export interface MemberRowProperties {
    handleRef?: React.Ref<MemberRowHandle>;
    teamID: string;
    memberID: string;
    x: number;
    y: number;
    label: string;
    skills: SkillDto[];
    onDragStart?: (teamID: string, memberID: string) => void;
    onDragMove?: (teamID: string, memberID: string) => void;
    onDragEnd?: (teamID: string, memberID: string) => void;
}

export interface MemberRowHandle {
    getWidth: () => number;
    getHeight: () => number;
}

const MemberRowFct = (props: MemberRowProperties) => {
    const theme = useContext(ThemeContext);
    const textRef = useRef<Konva.Text>(null);
    const groupRef = useRef<Konva.Group>(null);

    useImperativeHandle(props.handleRef, () => ({
        getWidth: () => {
            if(skillTagX.length > 0) {
                let width = textRef.current?.width() ?? 0;
                width += skillTagX[skillTagX.length - 1] - (skillTagX[0] ?? 0);
                return width;
            }
            return NaN;
        },
        getHeight: () => textRef.current?.height() ?? 0
    }));

    const skillTagRefs = useRef<{[key:string]:MutableRefObject<SkillTagHandle>}>({});
    props.skills.forEach((skill: SkillDto) => {
        skillTagRefs.current![skill.id] = skillTagRefs.current![skill.id] ?? createRef();
    });

    const [skillTagX, setSkillTagX] = useState<number[]>([]);
    
    useLayoutEffect(() => {
        const x: number[] = [];
        x.push((textRef.current?.x() ?? 0) + (textRef.current?.width() ?? 0) + theme.memberTagSpacing);

        Object.values(skillTagRefs.current!).forEach((ref: MutableRefObject<SkillTagHandle>) => {
            const lastX = x[x.length - 1];
            const newX = lastX + theme.memberTagSpacing + skillTagRefs.current![ref.current!.getID()].current!.getWidth();
            x.push(newX ?? 0);
        });

        setSkillTagX(x);
    }, []);

    const row = <Group
        _useStrictMode // then, render also updates x/y, so resetting is a change
        ref={groupRef}
        draggable
        onDragStart={(e) => {
            e.cancelBubble = true;
            props.onDragStart?.(props.teamID, props.memberID);
        }}
        onDragMove={() => {
            props.onDragMove?.(props.teamID, props.memberID)
        }}
        onDragEnd={() => {
            props.onDragEnd?.(props.teamID, props.memberID);
        }}
        x={props.x+theme.padding}
        y={props.y+theme.padding+theme.memberMarginTop}
        >
        <Text
            key={props.memberID}
            id={props.memberID}
            ref={textRef}
            fontSize={theme.fontSize}
            text={props.label}
        />
        {props.skills.map((skill: SkillDto, index: number) => 
        <SkillTag
            key={skill.id}
            ref={skillTagRefs.current![skill.id]}
            skill={skill ?? {}}
            x={isNaN(skillTagX[index]) ? 0 : skillTagX[index]}
            y={0}
        />)}
    </Group>

    return row;
};

export const MemberRow = React.forwardRef<MemberRowHandle, MemberRowProperties>((props, ref) => {
    const newProps = {
        ...props,
        handleRef: ref
    };
    return <MemberRowFct {...newProps} />
});