import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad } from 'typeorm';
import { Account } from './account.entity';
import { Chatbox } from './chatbox.entity';
import { format } from 'date-fns';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chatbox, (chatbox) => chatbox.chats)
  chatbox: Chatbox;

  @ManyToOne(() => Account, (account) => account.sentChats)
  sender: Account;

  @ManyToOne(() => Account, (account) => account.receivedChats)
  receiver: Account;

  @Column({ type: 'text' })
  content: string;

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
