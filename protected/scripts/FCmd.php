<?php
    class FCmd 
    {
        
        
        public static function listObjects()
        {
                        
            $finder = ObjectRecord::finder();
            $recs = $finder->findAll();
            foreach($recs as $r)
            {
                
                echo $r->Uid.' '.$r->ObjectType."\n";
                var_dump($r->getAncestorUids());                
            }
        }

        public static function updateMappings()
        {
            $command=$connection->createCommand('SELECT uid FROM cms_containers');
            $dataReader=$command->query();

        }
        
    }
    
?>
