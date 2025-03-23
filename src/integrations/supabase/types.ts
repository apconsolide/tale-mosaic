export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          academic_year: string | null
          content: string
          created_at: string
          description: string | null
          due_date: string | null
          grade_level: string | null
          id: string
          published: boolean | null
          semester: number | null
          subject: string | null
          subject_id: string | null
          submission_type: string | null
          title: string
          total_marks: number | null
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          content: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          grade_level?: string | null
          id?: string
          published?: boolean | null
          semester?: number | null
          subject?: string | null
          subject_id?: string | null
          submission_type?: string | null
          title: string
          total_marks?: number | null
          user_id: string
        }
        Update: {
          academic_year?: string | null
          content?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          grade_level?: string | null
          id?: string
          published?: boolean | null
          semester?: number | null
          subject?: string | null
          subject_id?: string | null
          submission_type?: string | null
          title?: string
          total_marks?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          academic_year: string | null
          content: string
          created_at: string
          description: string | null
          end_date: string | null
          grade_level: string | null
          id: string
          max_participants: number | null
          prize_description: string | null
          published: boolean | null
          start_date: string | null
          subject: string | null
          subject_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          content: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          grade_level?: string | null
          id?: string
          max_participants?: number | null
          prize_description?: string | null
          published?: boolean | null
          start_date?: string | null
          subject?: string | null
          subject_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          academic_year?: string | null
          content?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          grade_level?: string | null
          id?: string
          max_participants?: number | null
          prize_description?: string | null
          published?: boolean | null
          start_date?: string | null
          subject?: string | null
          subject_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      content_suggestions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lesson_id: string | null
          selected: boolean | null
          teacher_id: string | null
          type: Database["public"]["Enums"]["suggestion_type"]
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          selected?: boolean | null
          teacher_id?: string | null
          type: Database["public"]["Enums"]["suggestion_type"]
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          selected?: boolean | null
          teacher_id?: string | null
          type?: Database["public"]["Enums"]["suggestion_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_suggestions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lesson"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      event_analyses: {
        Row: {
          analysis: string
          created_at: string
          event_id: string
          id: string
          updated_at: string
        }
        Insert: {
          analysis: string
          created_at?: string
          event_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          analysis?: string
          created_at?: string
          event_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_analyses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_media: {
        Row: {
          caption: string | null
          created_at: string
          event_id: string
          id: string
          type: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_id: string
          id?: string
          type: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_id?: string
          id?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sources: {
        Row: {
          created_at: string
          event_id: string
          id: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_sources_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_year: string | null
          content: string
          created_at: string
          description: string | null
          duration: number | null
          exam_type: string | null
          grade_level: string | null
          id: string
          published: boolean | null
          semester: number | null
          subject: string | null
          subject_id: string | null
          title: string
          total_marks: number | null
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          content: string
          created_at?: string
          description?: string | null
          duration?: number | null
          exam_type?: string | null
          grade_level?: string | null
          id?: string
          published?: boolean | null
          semester?: number | null
          subject?: string | null
          subject_id?: string | null
          title: string
          total_marks?: number | null
          user_id: string
        }
        Update: {
          academic_year?: string | null
          content?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          exam_type?: string | null
          grade_level?: string | null
          id?: string
          published?: boolean | null
          semester?: number | null
          subject?: string | null
          subject_id?: string | null
          title?: string
          total_marks?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_items: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_base_relationships: {
        Row: {
          created_at: string
          id: string
          item1_id: string
          item1_type: string
          item2_id: string
          item2_type: string
          relationship_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item1_id: string
          item1_type: string
          item2_id: string
          item2_type: string
          relationship_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item1_id?: string
          item1_type?: string
          item2_id?: string
          item2_type?: string
          relationship_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_relationships_item1_id_fkey"
            columns: ["item1_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_relationships_item2_id_fkey"
            columns: ["item2_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          competencies: Database["public"]["Enums"]["competency_type"][] | null
          content: Json | null
          created_at: string
          created_by: string | null
          distribution_id: string | null
          estimated_duration: unknown | null
          id: string
          key_concepts: string[] | null
          language_resources: Json | null
          learning_situations: Json | null
          lesson_number: number
          lesson_title: string
          prerequisites: string[] | null
          text_types: Database["public"]["Enums"]["text_type"][] | null
          unit_number: number
          unit_title: string
          updated_at: string
          أسبوع: number | null
          أنشطة: Json[] | null
          أهداف: string[] | null
          إدماج: Json | null
          تراكيب_نحوية: string[] | null
          تقويم: Json | null
          فصل: string | null
          مقطع: string | null
          وضعية_انطلاقية: string | null
        }
        Insert: {
          competencies?: Database["public"]["Enums"]["competency_type"][] | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          distribution_id?: string | null
          estimated_duration?: unknown | null
          id?: string
          key_concepts?: string[] | null
          language_resources?: Json | null
          learning_situations?: Json | null
          lesson_number: number
          lesson_title: string
          prerequisites?: string[] | null
          text_types?: Database["public"]["Enums"]["text_type"][] | null
          unit_number: number
          unit_title: string
          updated_at?: string
          أسبوع?: number | null
          أنشطة?: Json[] | null
          أهداف?: string[] | null
          إدماج?: Json | null
          تراكيب_نحوية?: string[] | null
          تقويم?: Json | null
          فصل?: string | null
          مقطع?: string | null
          وضعية_انطلاقية?: string | null
        }
        Update: {
          competencies?: Database["public"]["Enums"]["competency_type"][] | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          distribution_id?: string | null
          estimated_duration?: unknown | null
          id?: string
          key_concepts?: string[] | null
          language_resources?: Json | null
          learning_situations?: Json | null
          lesson_number?: number
          lesson_title?: string
          prerequisites?: string[] | null
          text_types?: Database["public"]["Enums"]["text_type"][] | null
          unit_number?: number
          unit_title?: string
          updated_at?: string
          أسبوع?: number | null
          أنشطة?: Json[] | null
          أهداف?: string[] | null
          إدماج?: Json | null
          تراكيب_نحوية?: string[] | null
          تقويم?: Json | null
          فصل?: string | null
          مقطع?: string | null
          وضعية_انطلاقية?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_distribution_id_fkey"
            columns: ["distribution_id"]
            isOneToOne: false
            referencedRelation: "yearly_distributions"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_texts: {
        Row: {
          created_at: string
          lesson_id: string
          sequence_order: number
          text_id: string
        }
        Insert: {
          created_at?: string
          lesson_id: string
          sequence_order: number
          text_id: string
        }
        Update: {
          created_at?: string
          lesson_id?: string
          sequence_order?: number
          text_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_texts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_texts_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "literary_texts"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          academic_year: string | null
          content: string
          created_at: string
          description: string | null
          grade_level: string | null
          id: string
          learning_objectives: string[] | null
          published: boolean | null
          semester: number | null
          subject: string | null
          subject_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          content: string
          created_at?: string
          description?: string | null
          grade_level?: string | null
          id?: string
          learning_objectives?: string[] | null
          published?: boolean | null
          semester?: number | null
          subject?: string | null
          subject_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          academic_year?: string | null
          content?: string
          created_at?: string
          description?: string | null
          grade_level?: string | null
          id?: string
          learning_objectives?: string[] | null
          published?: boolean | null
          semester?: number | null
          subject?: string | null
          subject_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      literary_texts: {
        Row: {
          author: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          source: string | null
          title: string
          type: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          title: string
          type?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      objective_suggestions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lesson_id: string | null
          selected: boolean | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          selected?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          selected?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "objective_suggestions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          subject_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          subject_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          subject_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      related_events: {
        Row: {
          created_at: string
          event_id: string
          id: string
          related_event_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          related_event_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          related_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_events_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      situation_suggestions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lesson_id: string | null
          selected: boolean | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          selected?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          selected?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "situation_suggestions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subject_prompts: {
        Row: {
          created_at: string | null
          education_level: Database["public"]["Enums"]["education_level"] | null
          example_input: Json | null
          example_output: Json | null
          format_instructions: string | null
          id: string
          subject_group: Database["public"]["Enums"]["subject_group"] | null
          subject_id: string
          system_prompt: string
          type: Database["public"]["Enums"]["prompt_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          example_input?: Json | null
          example_output?: Json | null
          format_instructions?: string | null
          id?: string
          subject_group?: Database["public"]["Enums"]["subject_group"] | null
          subject_id: string
          system_prompt: string
          type: Database["public"]["Enums"]["prompt_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          example_input?: Json | null
          example_output?: Json | null
          format_instructions?: string | null
          id?: string
          subject_group?: Database["public"]["Enums"]["subject_group"] | null
          subject_id?: string
          system_prompt?: string
          type?: Database["public"]["Enums"]["prompt_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subject_prompts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          education_levels:
            | Database["public"]["Enums"]["education_level"][]
            | null
          id: string
          name: string
          subject_group: Database["public"]["Enums"]["subject_group"] | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          education_levels?:
            | Database["public"]["Enums"]["education_level"][]
            | null
          id?: string
          name: string
          subject_group?: Database["public"]["Enums"]["subject_group"] | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          education_levels?:
            | Database["public"]["Enums"]["education_level"][]
            | null
          id?: string
          name?: string
          subject_group?: Database["public"]["Enums"]["subject_group"] | null
          updated_at?: string
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          created_at: string
          education_level: Database["public"]["Enums"]["education_level"] | null
          has_selected_subjects: boolean
          id: string
          teaching_level: Database["public"]["Enums"]["teaching_level"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          has_selected_subjects?: boolean
          id: string
          teaching_level?: Database["public"]["Enums"]["teaching_level"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          has_selected_subjects?: boolean
          id?: string
          teaching_level?: Database["public"]["Enums"]["teaching_level"] | null
          updated_at?: string
        }
        Relationships: []
      }
      teacher_subjects: {
        Row: {
          created_at: string
          id: string
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_eras: {
        Row: {
          color: string | null
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          timeline_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          timeline_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          timeline_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_eras_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          position: string | null
          timeline_id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          position?: string | null
          timeline_id: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          position?: string | null
          timeline_id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      timelines: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          start_date: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      yearly_distributions: {
        Row: {
          academic_year: string
          content: Json
          created_at: string
          created_by: string | null
          education_level: Database["public"]["Enums"]["education_level_old"]
          grade_level: string
          id: string
          subject_id: string | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          content: Json
          created_at?: string
          created_by?: string | null
          education_level: Database["public"]["Enums"]["education_level_old"]
          grade_level: string
          id?: string
          subject_id?: string | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          content?: Json
          created_at?: string
          created_by?: string | null
          education_level?: Database["public"]["Enums"]["education_level_old"]
          grade_level?: string
          id?: string
          subject_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "yearly_distributions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assessment_type: "diagnostic" | "formative" | "summative"
      competency_type:
        | "listening_comprehension"
        | "reading_comprehension"
        | "written_production"
        | "integrated_skills"
      education_level: "primary" | "middle" | "secondary"
      education_level_old: "primary" | "middle" | "secondary"
      prompt_type: "lesson" | "assignment" | "exam" | "competition"
      subject_group:
        | "general"
        | "languages"
        | "physical_education"
        | "humanities"
        | "sciences"
        | "arabic_islamic"
        | "individual"
      subject_selection_type: "single" | "multiple"
      suggestion_type: "situation" | "objective"
      teaching_level: "elementary" | "middle" | "high"
      text_type:
        | "narrative"
        | "descriptive"
        | "argumentative"
        | "explanatory"
        | "dialogue"
      user_role: "teacher" | "admin" | "student" | "supervisor"
    }
    CompositeTypes: {
      arabic_lesson_content: {
        المقطع: string | null
        الفصل: string | null
        الأسبوع: number | null
        الوضعية_الانطلاقية: string | null
        الأهداف: string[] | null
        الأنشطة: Json[] | null
        التراكيب_النحوية: string[] | null
        التقويم: Json | null
        الإدماج: Json | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
