import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Box, LinearProgress, Typography, Zoom } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  getCategoryColor,
  getCategoryName,
} from "../../../helpers/notes/getters";
import PopIn from "../../Transitions/PopIn";
import SortableItem from "./Sortable/SortableItem";

export default function NotesTimeline({
  noteCollection,
  setNoteCollection,
  categoriesCollection,
  filteredNoteCollection,
  setCategoriesCollection,
  notesHidden,
  setNotesHidden,
  searchValue,
  noteStatus,
}) {
  //#region Hooks
  const [activeId, setActiveId] = useState(null); // activeId used to track the active note being dragged
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2, // Distance, in pixels, that the note must be dragged before it is considered active
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5, // Distance, in pixels, of motion that is tolerated before the drag operation is aborted
      },
    })
  );
  //#endregion

  //#region Handlers
  // Sets the active note id when a note is being dragged
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Swap the note indexes when a note is dropped after being dragged
  const handleDragEnd = ({ active, over }) => {
    // over is null when the note is dropped onto itself
    // Therefore, if over is null nothing needs to be done
    if (over && active.id !== over.id) {
      setNoteCollection((noteCollection) => {
        const oldIndex = active.data.current.sortable.index;
        const newIndex = over.data.current.sortable.index;
        return arrayMove(noteCollection, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };
  //#endregion

  const draggedNote = noteCollection.find((note) => note.id === activeId);

  return noteStatus === "loading" ? (
    <Zoom in>
      <Box width={"100%"}>
        <LinearProgress />
      </Box>
    </Zoom>
  ) : noteCollection.length > 0 ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      autoScroll
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext
        items={filteredNoteCollection}
        strategy={rectSortingStrategy}
      >
        {/*<DragOverlay>*/}
        {/*  {activeId ? (*/}
        {/*    <NoteDragOverlay*/}
        {/*      title={draggedNote.title}*/}
        {/*      description={draggedNote.description}*/}
        {/*      tags={draggedNote.tags}*/}
        {/*      categoryName={draggedNote.category}*/}
        {/*      color={*/}
        {/*        categoriesCollection.find(*/}
        {/*          (category) => category.name === draggedNote.category*/}
        {/*        )?.color*/}
        {/*      }*/}
        {/*    />*/}
        {/*  ) : null}*/}
        {/*</DragOverlay>*/}
        <Box
          p="1.5em"
          display="grid"
          gap="2em"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          justifyItems="center"
        >
          {/* AnimatePresence allows Components to animate out when they're removed from the React tree */}
          <AnimatePresence>
            {filteredNoteCollection.map((note, index) => (
              <SortableItem
                key={note.id}
                noteID={note.id}
                isDraggingMode={!!activeId} // If activeId is set, a note is being dragged
                index={index}
                title={note.title}
                description={note.description}
                tags={note.tags}
                categoryName={getCategoryName(
                  note.category_id,
                  categoriesCollection
                )}
                categoryColor={getCategoryColor(
                  note.category_id,
                  categoriesCollection
                )}
                searchValue={searchValue}
                noteCollection={noteCollection}
                categoriesCollection={categoriesCollection}
                setNoteCollection={setNoteCollection}
                setCategoriesCollection={setCategoriesCollection}
                notesHidden={notesHidden}
                setNotesHidden={setNotesHidden}
              />
            ))}
          </AnimatePresence>
        </Box>
        {/*  If filtered notes is 0, display no notes found message */}
        {filteredNoteCollection.length === 0 && (
          <PopIn visible>
            <Typography
              sx={{
                position: "absolute",
                width: "100%",
                top: "20vh",
                textAlign: "center",
              }}
              variant="h5"
            >
              No notes found...
            </Typography>
          </PopIn>
        )}
      </SortableContext>
    </DndContext>
  ) : (
    // If no notes, display no notes message
    <PopIn visible>
      <Typography
        variant={"h3"}
        sx={{
          position: "absolute",
          width: "100%",
          top: "20vh",
          textAlign: "center",
        }}
      >
        No notes yet.
      </Typography>
    </PopIn>
  );
}
