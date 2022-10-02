import SkillDto from "adapter/SkillDto";
import { ThemeContext } from "frontend/themes";
import Konva from "konva";
import React, { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { Group, Rect, Text } from "react-konva";

export interface SkillTagProperties {
    skill: SkillDto;
    x: number;
    y: number;
    handleRef?: React.Ref<SkillTagHandle>;
}

export interface SkillTagHandle {
    getWidth: () => number;
    getHeight: () => number;
    getID: () => string;
}

const SkillTagFct = (props: SkillTagProperties) => {
    const rectRef = useRef<Konva.Rect>(null);
    const textRef = useRef<Konva.Text>(null);

    useImperativeHandle(props.handleRef, () => ({
        getWidth: () => (textRef.current?.width() ?? 0) + theme.padding,
        getHeight: () => (textRef.current?.height() ?? 0) + theme.padding,
        getID: () => props.skill.id
    }));

    
    const theme = useContext(ThemeContext);

    return <Group>
        <Rect
            _useStrictMode
            ref={rectRef}
            cornerRadius={2}
            fill={props.skill.color}
            x={isNaN(props.x) ? 0 : props.x}
            y={props.y - theme.padding/2}
            width={(textRef.current?.width() ?? 0) + theme.padding}
            height={(textRef.current?.height() ?? 0) + theme.padding}
        />
        <Text
            _useStrictMode
            fontSize={theme.fontSize}
            x={isNaN(props.x + theme.padding / 2) ? 0 : props.x + theme.padding / 2}
            y={props.y}
            ref={textRef}
            text={props.skill.label + ":" + props.skill.level}
        />
    </Group>
};

export const SkillTag = forwardRef<SkillTagHandle, SkillTagProperties>((props, ref) => {
    const newProps = {
        ...props,
        handleRef: ref
    };

    return <SkillTagFct {...newProps} />;
});