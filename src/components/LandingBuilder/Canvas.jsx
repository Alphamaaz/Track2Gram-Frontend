import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableBlock from './SortableBlock';
import { Typography } from 'antd';

const { Text } = Typography;

const Canvas = ({ blocks, selectedBlockId, onSelectBlock, onUpdateBlock, onDeleteBlock }) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable',
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                maxWidth: '800px',
                margin: '0 auto',
                minHeight: 'calc(100vh - 100px)',
                background: 'white',
                borderRadius: '8px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px dashed #e8e8e8'
            }}
        >
            {blocks.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '100px', color: '#bfbfbf' }}>
                    <Text type="secondary">Drag elements here to start building</Text>
                </div>
            )}

            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => (
                    <SortableBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={onSelectBlock}
                        onUpdate={onUpdateBlock}
                        onDelete={onDeleteBlock}
                    />
                ))}
            </SortableContext>
        </div>
    );
};

export default Canvas;
