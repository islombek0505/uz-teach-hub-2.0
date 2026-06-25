"use client"

import { useEffect, useState } from "react"
import APIServiceController from "@/service/service.controller"
import { ICourseWithCount } from "@/types"

/** Reads published courses (the student catalog) with a lesson count. */
export function usePublishedCourses() {
  const [courses, setCourses] = useState<ICourseWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    APIServiceController.fetch<ICourseWithCount[]>(
      (db) =>
        db
          .from("courses")
          .select("*, lessons(count)")
          .eq("published", true)
          .order("created_at", { ascending: false }) as never,
      (data) => {
        setCourses(data ?? [])
        setLoading(false)
      }
    )
  }, [])

  return { courses, loading }
}
