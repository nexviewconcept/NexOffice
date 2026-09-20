import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Plus, Clock, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'REVIEW', title: 'Review' },
  { id: 'DONE', title: 'Done' }
];

export default function Tasks() {
  const { token, user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Optimistic update
      setTasks(prev => prev.map(t => 
        t.id === draggableId ? { ...t, status: destination.droppableId } : t
      ));
      
      try {
        await api.put(`/tasks/${draggableId}`, { status: destination.droppableId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        fetchTasks(); // Revert on error
      }
    }
  };

  const handleCreateTask = async () => {
    const title = prompt('Enter task title:');
    if (!title) return;
    
    try {
      const res = await api.post('/tasks', { title, status: 'TODO', priority: 'MEDIUM' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([res.data, ...tasks]);
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Kanban Board
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage staff tasks and project progress.</p>
        </div>
        <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            
            return (
              <div key={col.id} className="flex-1 min-w-[280px] bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 flex flex-col">
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {col.title} <span className="ml-1 text-gray-400 font-normal">({columnTasks.length})</span>
                  </h3>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-3 min-h-[200px] p-1 ${snapshot.isDraggingOver ? 'bg-gray-100/50 dark:bg-gray-800/20 rounded-lg' : ''}`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-gray-800 p-4 rounded-xl border ${snapshot.isDragging ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-100 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600'} transition-all group`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  task.priority === 'HIGH' || task.priority === 'URGENT' 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30' 
                                    : task.priority === 'LOW' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm mb-3">
                                {task.title}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                  {task.comments?.length > 0 && (
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-3 h-3" /> {task.comments.length}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5" title={new Date(task.createdAt).toLocaleString()}>
                                  <Clock className="w-3.5 h-3.5" />
                                  {format(new Date(task.createdAt), 'MMM d')}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
