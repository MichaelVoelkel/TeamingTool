import SkillDto from "adapter/SkillDto";
import { ThemeContext } from "frontend/themes";
import Konva from "konva";
import React, { useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Group, Text } from "react-konva";
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
};

export interface MemberRowHandle {
    getWidth: () => number;
    getHeight: () => number;
};

const MemberRowFct = (props: MemberRowProperties) => {
    const theme = useContext(ThemeContext);
    const textRef = useRef<Konva.Text>(null);
    const groupRef = useRef<Konva.Group>(null);

    useImperativeHandle(props.handleRef, () => ({
        getWidth: () => (textRef.current?.width() ?? 0) + (skillTagRef.current?.getWidth() ?? 0) + theme.memberTagSpacing,
        getHeight: () => textRef.current?.height() ?? 0
    }));

    const skillTagRef = useRef<SkillTagHandle>(null);
    const [skillTagX, setSkillTagX] = useState<number>(0);
    
    useLayoutEffect(() => {
        setSkillTagX((textRef.current?.x() ?? 0) + (textRef.current?.width() ?? 0) + theme.memberTagSpacing);
    });

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
        <SkillTag
            ref={skillTagRef}
            skill={props.skills[0] ?? {}}
            x={skillTagX}
            y={0}
        />
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