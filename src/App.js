import { useState } from 'react';
import './App.css';

function App() {
    let [document] = useState({
        objectId: "12345",
        pages: [
            {
                content: "1"
            },
            {
                content: "2"
            },
            {
                content: "3"
            },
            {
                content: "4"
            },
            {
                content: "5"
            }
        ]
    });

    let [newDocument, setNewDocument] = useState({
        pages: []
    });

    let [dragTarget, setDragTarget] = useState(null);
    let [draggedDocument, setDraggedDocument] = useState(null);

    const allowDrop = (evt, dragTarget) => {
        evt.preventDefault();
        evt.stopPropagation();
        setDragTarget(dragTarget);
    }

    const drag = (evt, document, dragged, draggedIndex) => {
        evt.dataTransfer.setData("document", JSON.stringify(document));
        evt.dataTransfer.setData("dragged", JSON.stringify({
            dragged,
            draggedIndex
        }));
        setDraggedDocument(document);
    }

    const drop = (evt, list, dropped, droppedIndex, update) => {
        evt.preventDefault();
        evt.stopPropagation();

        if (droppedIndex === -1) {
            droppedIndex = list.length
        }

        let document = JSON.parse(evt.dataTransfer.getData("document"));
        let {dragged, draggedIndex} = JSON.parse(evt.dataTransfer.getData("dragged"));
        let listCopy = [...list];

        if (dragged === dropped) {
            let [remove] = listCopy.splice(droppedIndex, 1);
            listCopy.splice(draggedIndex, 0, remove);
        } else {
            listCopy.splice(droppedIndex, 0, document);
        }

        update(listCopy);
        setDragTarget(null);
        setDraggedDocument(null);
    }

    const getClass = (index) => {
        if (index === dragTarget) {
            return "page drag-target";
        }

        return "page";
    }

    return (
        <div className="container">
            <div className="left">
                <h2>Documents</h2>
                <div 
                    className="grid"
                >
                    {document.pages.map((document, index) => (
                        <div 
                            className="page"
                            draggable
                            onDragStart={(evt) => {drag(evt, document, "document", index)}}
                        >
                            {document.content}
                        </div>
                    ))}
                </div>
            </div>
            <div className="right">
                <h2>New Document</h2>
                <div 
                    className="grid"
                    onDragOver={(evt) => {allowDrop(evt)}}
                    onDrop={(evt) => {drop(evt, newDocument.pages, "newDocument", -1, (pages) => {
                        setNewDocument({...newDocument, pages})
                    })}}
                >
                    {newDocument.pages.map((document, index) => (
                        <>
                            {draggedDocument && index === dragTarget ? 
                                <div 
                                    className="page invisible"
                                    onDragOver={(evt) => {allowDrop(evt, index)}}
                                    onDragStart={(evt) => {drag(evt, document, "newDocument", index)}}
                                    onDrop={(evt) => {drop(evt, newDocument.pages, "newDocument", index, (pages) => {
                                        setNewDocument({...newDocument, pages})
                                    })}}
                                >
                                </div> : null
                            }
                            {draggedDocument && document === draggedDocument ? 
                                <div 
                                    className="page invisible"
                                    onDragOver={(evt) => {allowDrop(evt, index)}}
                                    onDragStart={(evt) => {drag(evt, document, "newDocument", index)}}
                                    onDrop={(evt) => {drop(evt, newDocument.pages, "newDocument", index, (pages) => {
                                        setNewDocument({...newDocument, pages})
                                    })}}
                                >
                                    {document.content}
                                </div> : 
                                <div 
                                    className="page"
                                    draggable
                                    onDragOver={(evt) => {allowDrop(evt, index)}}
                                    onDragStart={(evt) => {drag(evt, document, "newDocument", index)}}
                                    onDrop={(evt) => {drop(evt, newDocument.pages, "newDocument", index, (pages) => {
                                        setNewDocument({...newDocument, pages})
                                    })}}
                                >
                                    {document.content}
                                </div>
                            }
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
