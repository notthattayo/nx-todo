export enum Statuses {
    pending = 'pending',
    completed = 'completed',
  }
 export  type Task = {
    id: number;
    status: Statuses;
    task: string;
  };
  