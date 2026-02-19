import { createSlice } from '@reduxjs/toolkit';
import {
  getAllStudents,
  getDomainStats,
  deleteStudent,
  getStudentsByCourse,
  markStudentViewed,
  markCourseViewed,
  updateStudentStatus
} from './studentsThunks';

const initialState = {
  allStudents: [],
  newStudents: [],
  inProgressStudents: [],
  completedStudents: [],
  medicalStudents: [],
  pharmacyStudents: [],
  nursingStudents: [],
  paramedicalStudents: [],
  engineeringStudents: [],
  managementStudents: [],
  graduationStudents: [],
  postGraduationStudents: [],
  vocationalStudents: [],
  languageStudents: [],
  agricultureStudents: [],
  educationStudents: [],
  stats: {
    domain: [],
    course: [],
    overall: { total: 0, new: 0, inProgress: 0, completed: 0 }
  },
  loading: false,
  error: null
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearStudents: (state) => {
      state.allStudents = [];
      state.newStudents = [];
      state.inProgressStudents = [];
      state.completedStudents = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // GET ALL STUDENTS
      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        
        let students = [];
        
        // Handle your API response { success: true, clients: [...] }
        if (action.payload?.clients && Array.isArray(action.payload.clients)) {
          students = action.payload.clients;
        } else if (Array.isArray(action.payload)) {
          students = action.payload;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          students = action.payload.data;
        } else {
          console.warn('Unexpected API response:', action.payload);
          students = [];
        }
        
        state.allStudents = students;
        
        // Filter by status
        state.newStudents = students.filter(s => s?.status === 'new' && !s?.studentViewed) || [];
        state.inProgressStudents = students.filter(s => s?.status === 'in-progress') || [];
        state.completedStudents = students.filter(s => s?.status === 'completed') || [];
        
        // Filter by domain
        state.medicalStudents = students.filter(s => s?.domain === 'MEDICAL') || [];
        state.pharmacyStudents = students.filter(s => s?.domain === 'PHARMACY') || [];
        state.nursingStudents = students.filter(s => s?.domain === 'NURSING') || [];
        state.paramedicalStudents = students.filter(s => s?.domain === 'PARAMEDICAL') || [];
        state.engineeringStudents = students.filter(s => s?.domain === 'ENGINEERING') || [];
        state.managementStudents = students.filter(s => s?.domain === 'MANAGEMENT') || [];
        state.graduationStudents = students.filter(s => s?.domain === 'GRADUATION') || [];
        state.postGraduationStudents = students.filter(s => s?.domain === 'POST GRADUATION') || [];
        state.vocationalStudents = students.filter(s => s?.domain === 'VOCATIONAL') || [];
        state.languageStudents = students.filter(s => s?.domain === 'LANGUAGES') || [];
        state.agricultureStudents = students.filter(s => s?.domain === 'AGRICULTURE') || [];
        state.educationStudents = students.filter(s => s?.domain === 'EDUCATION') || [];
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // GET DOMAIN STATS
      .addCase(getDomainStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDomainStats.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload) {
          if (action.payload.stats) {
            state.stats = action.payload.stats;
          } else if (action.payload.domain || action.payload.course || action.payload.overall) {
            state.stats = action.payload;
          }
        }
      })
      .addCase(getDomainStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // DELETE STUDENT
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?.id;
        
        if (deletedId) {
          state.allStudents = state.allStudents.filter(s => s?._id !== deletedId);
          state.newStudents = state.newStudents.filter(s => s?._id !== deletedId);
          state.inProgressStudents = state.inProgressStudents.filter(s => s?._id !== deletedId);
          state.completedStudents = state.completedStudents.filter(s => s?._id !== deletedId);
          
          state.medicalStudents = state.medicalStudents.filter(s => s?._id !== deletedId);
          state.pharmacyStudents = state.pharmacyStudents.filter(s => s?._id !== deletedId);
          state.nursingStudents = state.nursingStudents.filter(s => s?._id !== deletedId);
          state.paramedicalStudents = state.paramedicalStudents.filter(s => s?._id !== deletedId);
          state.engineeringStudents = state.engineeringStudents.filter(s => s?._id !== deletedId);
          state.managementStudents = state.managementStudents.filter(s => s?._id !== deletedId);
          state.graduationStudents = state.graduationStudents.filter(s => s?._id !== deletedId);
          state.postGraduationStudents = state.postGraduationStudents.filter(s => s?._id !== deletedId);
          state.vocationalStudents = state.vocationalStudents.filter(s => s?._id !== deletedId);
          state.languageStudents = state.languageStudents.filter(s => s?._id !== deletedId);
          state.agricultureStudents = state.agricultureStudents.filter(s => s?._id !== deletedId);
          state.educationStudents = state.educationStudents.filter(s => s?._id !== deletedId);
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // GET STUDENTS BY COURSE
      .addCase(getStudentsByCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getStudentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ FIXED: MARK STUDENT VIEWED - WITH STATS UPDATE
      .addCase(markStudentViewed.fulfilled, (state, action) => {
        const clientId = action.meta.arg;
        
        // Find the student to get their domain
        const student = state.allStudents.find(s => s._id === clientId);
        const studentDomain = student?.domain;
        
        // Update in all arrays
        const updateStudent = (s) => 
          s._id === clientId ? { ...s, studentViewed: true, isNew: false } : s;
        
        state.allStudents = state.allStudents.map(updateStudent);
        state.newStudents = state.newStudents.filter(s => s._id !== clientId);
        state.inProgressStudents = state.inProgressStudents.map(updateStudent);
        state.completedStudents = state.completedStudents.map(updateStudent);
        
        // Update domain arrays
        state.medicalStudents = state.medicalStudents.map(updateStudent);
        state.pharmacyStudents = state.pharmacyStudents.map(updateStudent);
        state.nursingStudents = state.nursingStudents.map(updateStudent);
        state.paramedicalStudents = state.paramedicalStudents.map(updateStudent);
        state.engineeringStudents = state.engineeringStudents.map(updateStudent);
        state.managementStudents = state.managementStudents.map(updateStudent);
        state.graduationStudents = state.graduationStudents.map(updateStudent);
        state.postGraduationStudents = state.postGraduationStudents.map(updateStudent);
        state.vocationalStudents = state.vocationalStudents.map(updateStudent);
        state.languageStudents = state.languageStudents.map(updateStudent);
        state.agricultureStudents = state.agricultureStudents.map(updateStudent);
        state.educationStudents = state.educationStudents.map(updateStudent);
        
        // ✅ IMPORTANT: Update stats to remove NEW badge from domain cards
        if (state.stats?.domain && studentDomain) {
          state.stats.domain = state.stats.domain.map(domain => {
            if (domain.domain === studentDomain) {
              const newCount = Math.max(0, (domain.new || 0) - 1);
              return {
                ...domain,
                new: newCount,
                hasNew: newCount > 0
              };
            }
            return domain;
          });
         
          if (state.stats.overall) {
            state.stats.overall.new = Math.max(0, (state.stats.overall.new || 0) - 1);
          }
        }
        
        console.log(`✅ Student ${clientId} marked as viewed`);
      })
      .addCase(markStudentViewed.rejected, (state, action) => {
        state.error = action.payload;
      })
      
    
      .addCase(markCourseViewed.fulfilled, (state, action) => {
        console.log('Course marked viewed');
      })
      
      .addCase(updateStudentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudentStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        const updatedClient = action.payload?.client || action.payload;
        if (updatedClient?._id) {
          const clientId = updatedClient._id;
          
          const updateStatus = (s) => 
            s._id === clientId ? { ...s, status: updatedClient.status } : s;
          
          state.allStudents = state.allStudents.map(updateStatus);
          state.newStudents = state.allStudents.filter(s => s.status === 'new' && !s.studentViewed);
          state.inProgressStudents = state.allStudents.filter(s => s.status === 'in-progress');
          state.completedStudents = state.allStudents.filter(s => s.status === 'completed');
          
          state.medicalStudents = state.medicalStudents.map(updateStatus);
          state.pharmacyStudents = state.pharmacyStudents.map(updateStatus);
          state.nursingStudents = state.nursingStudents.map(updateStatus);
          state.paramedicalStudents = state.paramedicalStudents.map(updateStatus);
          state.engineeringStudents = state.engineeringStudents.map(updateStatus);
          state.managementStudents = state.managementStudents.map(updateStatus);
          state.graduationStudents = state.graduationStudents.map(updateStatus);
          state.postGraduationStudents = state.postGraduationStudents.map(updateStatus);
          state.vocationalStudents = state.vocationalStudents.map(updateStatus);
          state.languageStudents = state.languageStudents.map(updateStatus);
          state.agricultureStudents = state.agricultureStudents.map(updateStatus);
          state.educationStudents = state.educationStudents.map(updateStatus);
        }
      })
      .addCase(updateStudentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStudents } = studentsSlice.actions;
export default studentsSlice.reducer;

