"use client"

import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "@/components/shared/profile.form"
import ChangePasswordForm from "@/components/shared/change-password.form"

function StudentProfilePresenter() {
  return (
    <Container>
      <Topbar title="Profil" desc="Shaxsiy ma'lumotlaringizni boshqaring." />
      <Section className="mt-8 max-w-2xl rounded-3xl bg-white p-6 shadow-sm">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="password">Parol</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-4">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="password" className="mt-4">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </Section>
    </Container>
  )
}

export default StudentProfilePresenter
