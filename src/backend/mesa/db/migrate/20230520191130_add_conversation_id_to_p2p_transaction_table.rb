# frozen_string_literal: true

class AddConversationIdToP2pTransactionTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "p2p_transactions" ADD COLUMN "conversation_id" INTEGER NOT NULL;
    SQL

    execute <<-SQL
      CREATE INDEX "index_p2p_transaction_on_conversation_id" ON "p2p_transactions" ("conversation_id");
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "conversation_id";
    SQL

    execute <<-SQL
      DROP INDEX "index_p2p_transaction_on_conversation_id";
    SQL
  end
end
