import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad } from 'typeorm';
import { Chat } from './chat.entity';
import { format } from 'date-fns';

@Entity('chatbox')
export class Chatbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @OneToMany(() => Chat, (chat) => chat.chatbox)
  chats: Chat[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @AfterLoad()
  transformDates() {
    if (this.created_at) {
      this.created_at = format(new Date(this.created_at), 'HH:mm dd/MM/yyyy') as any;
    }
    if (this.updated_at) {
      this.updated_at = format(new Date(this.updated_at), 'HH:mm dd/MM/yyyy') as any;
    }
  }
}
