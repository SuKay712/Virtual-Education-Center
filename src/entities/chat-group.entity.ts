import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, AfterLoad } from 'typeorm';
import { Account } from './account.entity';
import { Chatbox } from './chatbox.entity';
import { format } from 'date-fns';

@Entity('chat_group')
export class ChatGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Account)
  @JoinTable({
    name: 'chat_group_members',
    joinColumn: {
      name: 'chat_group_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'account_id',
      referencedColumnName: 'id',
    },
  })
  members: Account[];

  @OneToMany(() => Chatbox, (chatbox) => chatbox.chatGroup)
  chatboxes: Chatbox[];

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
