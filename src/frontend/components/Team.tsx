import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useState } from 'react'
import { Group, Rect, Text } from "react-konva";

export interface TeamProperties {
    names: string[];
}

interface MemberProperties {
    id: string,
    name: string,
    y: number
}

export function Team(props: TeamProperties) {
    const names = props.names;
    const FONT_SIZE = 14;
    const LINE_HEIGHT = FONT_SIZE * 1.5;
    const PADDING = 4;

    const [totalHeight, setTotalHeight] = useState(0);
    const [members, setMembers] = useState<MemberProperties[]>([]);

    const renderAgain = () => {
        let y = 0;

        let candidates = members.map(member => member.name);

        names.forEach((name: string) => {
            let found = candidates.find(existingName => existingName == name) !== undefined;
            if(!found) {
                candidates.push(name);
            }
        })

        const newMembers = candidates.map((name: string) => {
            const member = {
                id: name,
                name: name,
                y: y
            }
            y += LINE_HEIGHT;
            
            return member;
        });

        setMembers([...newMembers]);
        console.log("Do change");

        setTotalHeight(props.names.length * LINE_HEIGHT);
    };

    useEffect(() => {
        renderAgain();
    }, [props.names]);

    let changed = false;

    const onMv = (e: KonvaEventObject<DragEvent>) => {
        const text = e.target;
        const targetIdx = members.findIndex(member => member.id == text.id());
        const target = members[targetIdx];

        for(let memberIdx in members) {
            let member = members[memberIdx];
            if(member.id != target!.id) {
                const movedUp = member.y < target!.y && member.y > e.target.position().y;
                const movedDown = member.y > target!.y && member.y < e.target.position().y;
                if(movedUp || movedDown) {
                    const temp = members[targetIdx];
                    members[targetIdx] = members[memberIdx];
                    members[memberIdx] = temp;
                    console.log("MV: tried swapping " + memberIdx + " " + targetIdx);
                    changed = true;
                    // more sense makes some swap logic
                    break;
                }
            }
        }
    };

    const onDrEnd = () => {
        console.log("Changed " + changed);
        if(changed) {
            setMembers([...members]);
            renderAgain();
        }
    };

    return <Group draggable x={300}>
        <Rect id="rect" stroke={Math.floor(Math.random()*16777215).toString(16)} width={100} height={totalHeight}></Rect>

        {members.map((member: MemberProperties) => { 
            let onMove: Function;
            const row = <Text draggable 
                onDragStart={(e) => {e.cancelBubble = true;}}
                key={Math.floor(Math.random()*16777215).toString(16)}
                id={member.id}
                fontSize={FONT_SIZE}
                text={member.name}
                onDragMove={(e) => onMv(e)}
                onDragEnd={onDrEnd}
                x={PADDING}
                y={member.y+PADDING} />

            return row;
        })}
        
    </Group>
}