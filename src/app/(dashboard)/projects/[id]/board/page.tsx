import { TaskBoardPage } from "@/presentation/pages/tasks/TaskBoardPage";

export default function Page({ params }: { params: { id: string } }) {
  return <TaskBoardPage projectId={params.id} />;
}
