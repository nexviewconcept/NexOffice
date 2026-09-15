import { useState, useEffect } from 'react';
import { BookOpen, Plus, Users, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Courses() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', duration: '', fee: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/courses', {
        ...formData,
        fee: parseFloat(formData.fee)
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', duration: '', fee: '' });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses & Training</h1>
          <p className="text-sm text-gray-500">Manage training programs and curriculums</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-[#E50914] rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {course.status}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{course.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Enrolled</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                Duration: {course.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Course Title" value={formData.title} onChange={(e: any) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Duration (e.g. 3 Months)" value={formData.duration} onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })} required />
          <Input type="number" label="Course Fee (₦)" value={formData.fee} onChange={(e: any) => setFormData({ ...formData, fee: e.target.value })} required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea 
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" 
              rows={3}
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
