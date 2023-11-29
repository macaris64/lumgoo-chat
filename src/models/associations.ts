import { User } from './user.model';
import { Thread } from './thread.model';
import { Character } from './character.model';
import { Message } from './message.model';


export function setupAssociations(): void {
  // User-Thread Many-to-Many relation
  User.belongsToMany(Thread, { through: 'UserThreads' });
  Thread.belongsToMany(User, { through: 'UserThreads' });

  // Character-Thread Many-to-Many relation
  Character.belongsToMany(Thread, { through: 'CharacterThreads' });
  Thread.belongsToMany(Character, { through: 'CharacterThreads' });

  // Message-Thread One-to-Many relation
  Thread.hasMany(Message, { foreignKey: 'threadId' });
  Message.belongsTo(Thread, { foreignKey: 'threadId' });

  // Optionally add more relationships and indexes here
}
